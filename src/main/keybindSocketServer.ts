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

import { log } from "console";
import { read, unlinkSync, write } from "fs";
import { createConnection, createServer } from "net";
import { join } from 'path';
import { platform, env, on } from 'process';
import { encode } from "punycode";

const SOCKET_PATH = platform === 'win32' ? '\\\\?\\pipe\\vesktop-keybind-ipc'
    : join(env.XDG_RUNTIME_DIR || env.TMPDIR || env.TMP || env.TEMP || '/tmp', 'vesktop-keybind-ipc');

const server = createServer((socket) => {
    socket.on('data', (d) => {
        var data = d.toString().replaceAll('\n', '');
        console.log('Received data from keybind:', data);
    });
    socket.on('error', (err) => {
        console.error('Keybind socket error:', err);
    });
});

server.on('error', (err) => {
    console.error('Keybind socket server error:', err);
});

if (platform !== 'win32') try { unlinkSync(SOCKET_PATH); } catch { }
server.listen(SOCKET_PATH, () => {
    console.log('Keybind socket server listening on', SOCKET_PATH);
});