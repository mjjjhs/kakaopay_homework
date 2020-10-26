declare module 'react' {
    interface RefObject<T> {
        readonly current: T | null
    }
}