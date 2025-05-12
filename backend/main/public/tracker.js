(function () {
    const script = document.createElement("script")
    script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js"
    document.head.appendChild(script)

    script.onload = () => {
        const socket = io('http://127.0.0.1:5000')

        socket.on('connect', () => {
            console.log('Connected to WebSocket server')
            socket.emit('track_pageview', { page: location.pathname })
        })

        socket.on('disconnect', () => {
            console.warn('Disconnected from WebSocket server')
        })

        // Optional: expose emit function globally
        window.emitSocketEvent = (event, data) => {
            if (socket.connected) {
                socket.emit(event, data)
                console.log(`Sent: ${event}`, data)
            }
        }
    }
})()