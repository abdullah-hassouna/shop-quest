let ioInstance: any = null;

let ioReadyResolve: ((io: any) => void) | null = null;
const ioReady = new Promise<any>((resolve) => {
    ioReadyResolve = resolve;
});

export function setIO(instance: any) {
    if (!ioInstance) {
        ioInstance = instance;
        if (ioReadyResolve) ioReadyResolve(ioInstance);
    }
}

export async function getIO() {
    return await ioReady;
}

export async function emitToUser(userId: string, message: string) {
    const io = await getIO(); 
    console.log("📤 Sending notification to:", userId, message);
    io.to(userId).emit("notification", message);
}