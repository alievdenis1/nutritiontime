export {}

declare global {
    interface Window {
        Pusher: any;
        Echo: any; // Если вы также используете window.Echo
    }
}