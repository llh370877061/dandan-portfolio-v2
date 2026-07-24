import Foundation
import AppKit

// ============================================================
// 语音输入助手 — macOS App
// 启动本地 HTTP server，用 Chrome --app 模式打开语音输入页面
// ============================================================

let PORT: UInt16 = 18925
let USER_DATA_DIR = NSHomeDirectory() + "/Library/Application Support/VoiceInputAssistant"

// 定位 index.html：app 同级目录
let appBundlePath = Bundle.main.bundlePath
let appDir = (appBundlePath as NSString).deletingLastPathComponent
let htmlDir: String

// 如果在 .app bundle 内，向上找到 Resources 同级
if appBundlePath.hasSuffix(".app") {
    // .app/Contents/MacOS/binary → ../../ = .app 同目录
    htmlDir = (appDir as NSString).deletingLastPathComponent
        + "/../../" + "语音输入助手"
} else {
    // 开发模式：直接在当前目录
    htmlDir = (FileManager.default.currentDirectoryPath)
}

let htmlPath = (htmlDir as NSString).standardizingPath

// 检查文件是否存在
guard FileManager.default.fileExists(atPath: htmlPath + "/index.html") else {
    let alert = NSAlert()
    alert.messageText = "找不到语音输入页面"
    alert.informativeText = "未在以下路径找到 index.html：\n\(htmlPath)"
    alert.alertStyle = .warning
    alert.addButton(withTitle: "好")
    alert.runModal()
    exit(1)
}

// ============================================================
// 启动本地 HTTP Server
// ============================================================

class LocalServer {
    let port: UInt16
    let rootPath: String
    var serverSocket: Int32 = -1
    var running = false

    init(port: UInt16, rootPath: String) {
        self.port = port
        self.rootPath = rootPath
    }

    func start() throws {
        serverSocket = socket(AF_INET, SOCK_STREAM, 0)
        guard serverSocket >= 0 else {
            throw NSError(domain: "Server", code: 1, userInfo: [NSLocalizedDescriptionKey: "创建 socket 失败"])
        }

        var reuse: Int32 = 1
        setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, &reuse, socklen_t(MemoryLayout<Int32>.size))

        var addr = sockaddr_in()
        addr.sin_len = UInt8(MemoryLayout<sockaddr_in>.size)
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_port = port.bigEndian
        addr.sin_addr.s_addr = INADDR_LOOPBACK

        let bindResult = withUnsafePointer(to: &addr) { ptr in
            ptr.withMemoryRebound(to: sockaddr.self, capacity: 1) { sockPtr in
                bind(serverSocket, sockPtr, socklen_t(MemoryLayout<sockaddr_in>.size))
            }
        }
        guard bindResult == 0 else {
            close(serverSocket)
            throw NSError(domain: "Server", code: 2, userInfo: [NSLocalizedDescriptionKey: "端口 \(port) 被占用，请稍后再试"])
        }

        guard listen(serverSocket, 5) == 0 else {
            close(serverSocket)
            throw NSError(domain: "Server", code: 3, userInfo: [NSLocalizedDescriptionKey: "监听失败"])
        }

        running = true

        DispatchQueue.global(qos: .background).async { [weak self] in
            self?.acceptLoop()
        }
    }

    func stop() {
        running = false
        if serverSocket >= 0 {
            close(serverSocket)
            serverSocket = -1
        }
    }

    private func acceptLoop() {
        while running {
            var clientAddr = sockaddr_in()
            var clientLen = socklen_t(MemoryLayout<sockaddr_in>.size)
            let clientSocket = withUnsafeMutablePointer(to: &clientAddr) { ptr in
                ptr.withMemoryRebound(to: sockaddr.self, capacity: 1) { sockPtr in
                    accept(serverSocket, sockPtr, &clientLen)
                }
            }
            guard clientSocket >= 0 else { continue }

            DispatchQueue.global(qos: .utility).async { [weak self] in
                self?.handleClient(clientSocket)
            }
        }
    }

    private func handleClient(_ fd: Int32) {
        defer { close(fd) }

        var buf = [UInt8](repeating: 0, count: 4096)
        let bytesRead = read(fd, &buf, buf.count)
        guard bytesRead > 0 else { return }

        let request = String(bytes: buf[0..<bytesRead], encoding: .utf8) ?? ""
        let firstLine = request.components(separatedBy: "\r\n").first ?? ""

        // 解析路径
        var path = "index.html"
        if let range = firstLine.range(of: " ") {
            let rest = String(firstLine[range.upperBound...])
            if let endRange = rest.range(of: " ") {
                path = String(rest[rest.startIndex..<endRange.lowerBound]).removingPercentEncoding ?? "index.html"
            }
        }

        if path == "/" || path.isEmpty { path = "index.html" }
        if path.hasPrefix("/") { path = String(path.dropFirst()) }

        // 安全检查
        if path.contains("..") {
            let resp = "HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n"
            resp.withCString { _ = write(fd, $0, strlen($0)) }
            return
        }

        let filePath = (rootPath as NSString).appendingPathComponent(path)

        if let data = FileManager.default.contents(atPath: filePath) {
            let ext = (path as NSString).pathExtension.lowercased()
            let mime = mimeType(for: ext)
            let header = "HTTP/1.1 200 OK\r\nContent-Type: \(mime); charset=utf-8\r\nContent-Length: \(data.count)\r\nAccess-Control-Allow-Origin: *\r\n\r\n"
            header.withCString { _ = write(fd, $0, strlen($0)) }
            data.withUnsafeBytes { raw in
                _ = raw.baseAddress!.assumingMemoryBound(to: UInt8.self).withMemoryRebound(to: CChar.self, capacity: data.count) { ptr in
                    write(fd, ptr, data.count)
                }
            }
        } else {
            let body = "404 Not Found"
            let header = "HTTP/1.1 404 Not Found\r\nContent-Length: \(body.count)\r\nContent-Type: text/plain\r\n\r\n\(body)"
            header.withCString { _ = write(fd, $0, strlen($0)) }
        }
    }

    private func mimeType(for ext: String) -> String {
        switch ext {
        case "html": return "text/html"
        case "css": return "text/css"
        case "js", "mjs": return "application/javascript"
        case "json": return "application/json"
        case "png": return "image/png"
        case "jpg", "jpeg": return "image/jpeg"
        case "gif": return "image/gif"
        case "svg": return "image/svg+xml"
        case "ico": return "image/x-icon"
        case "woff2": return "font/woff2"
        case "woff": return "font/woff"
        default: return "application/octet-stream"
        }
    }
}

// ============================================================
// App 启动
// ============================================================

let server = LocalServer(port: PORT, rootPath: htmlPath)

do {
    try server.start()
    print("本地服务已启动: http://localhost:\(PORT)")
} catch {
    let alert = NSAlert()
    alert.messageText = "启动失败"
    alert.informativeText = error.localizedDescription
    alert.alertStyle = .critical
    alert.addButton(withTitle: "好")
    alert.runModal()
    exit(1)
}

// 用 Chrome --app 模式打开
let urlString = "http://localhost:\(PORT)/index.html"
let userDataDir = USER_DATA_DIR

// 确保 user-data-dir 存在
try? FileManager.default.createDirectory(atPath: userDataDir, withIntermediateDirectories: true)

let chromeArgs = [
    "--app=\(urlString)",
    "--user-data-dir=\(userDataDir)"
]

if let chromeURL = NSWorkspace.shared.urlForApplication(withBundleIdentifier: "com.google.Chrome") {
    let configuration = NSWorkspace.OpenConfiguration()
    configuration.arguments = chromeArgs
    NSWorkspace.shared.openApplication(at: chromeURL, configuration: configuration)

    print("Chrome 已打开: \(urlString)")
} else {
    // Chrome 未安装，尝试用默认浏览器
    let alert = NSAlert()
    alert.messageText = "未找到 Google Chrome"
    alert.informativeText = "将使用默认浏览器打开。语音识别功能可能受限。\n\n建议安装 Chrome 以获得最佳体验。"
    alert.alertStyle = .informational
    alert.addButton(withTitle: "继续")
    alert.addButton(withTitle: "取消")
    if alert.runModal() == .alertFirstButtonReturn {
        NSWorkspace.shared.open(URL(string: urlString)!)
    } else {
        server.stop()
        exit(0)
    }
}

// 保持 app 运行，直到用户退出
RunLoop.current.run()
