#!/bin/sh

if [ -n "$XDG_RUNTIME_DIR" ]; then
    SOCKET_PATH="$XDG_RUNTIME_DIR/vesktop-keybind-ipc"
elif [ -n "$TMPDIR" ]; then
    SOCKET_PATH="$TMPDIR/vesktop-keybind-ipc"
elif [ -n "$TMP" ]; then
    SOCKET_PATH="$TMP/vesktop-keybind-ipc"
elif [ -n "$TEMP" ]; then
    SOCKET_PATH="$TEMP/vesktop-keybind-ipc"
else
    SOCKET_PATH="/tmp/vesktop-keybind-ipc"
fi

if [ -z "$1" ]; then
    echo "Usage: $0 <message>"
    echo "Example: $0 [toggleMute/toggleDeafen]"
    exit 1
fi

MESSAGE="$1"

printf "%s" "$MESSAGE" | nc -U "$SOCKET_PATH"
