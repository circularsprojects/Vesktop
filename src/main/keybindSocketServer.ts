/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
 * custom modification by circular to add "global keybinds" to vesktop
 * global keybinds in the sense that its up to you (and your system/de) to make the actual keybinds,
 * and then have them interact with the socket server here.
 */

import { unlinkSync } from "fs";
import { createServer } from "net";
import { join } from "path";
import { env, platform } from "process";

import { sendRendererCommand } from "./ipcCommands";

const SOCKET_PATH =
    platform === "win32"
        ? "\\\\?\\pipe\\vesktop-keybind-ipc"
        : join(env.XDG_RUNTIME_DIR || env.TMPDIR || env.TMP || env.TEMP || "/tmp", "vesktop-keybind-ipc");

const server = createServer(socket => {
    socket.on("data", d => {
        var data = d.toString().replaceAll("\n", "");
        console.log("Received data from keybind:", data);
        sendRendererCommand(data);
    });
    socket.on("error", err => {
        console.error("Keybind socket error:", err);
    });
});

server.on("error", err => {
    console.error("Keybind socket server error:", err);
});

if (platform !== "win32")
    try {
        unlinkSync(SOCKET_PATH);
    } catch {
        console.warn("Can't unlink keybind socket path, it probably doesn't exist yet, or is in use.");
    }
server.listen(SOCKET_PATH, () => {
    console.log("Keybind socket server listening on", SOCKET_PATH);
});
