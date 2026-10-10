export function isCreateTaskInput(value) {
    if (typeof value !== "object" || value === null)
        return false;
    const candidate = value;
    return typeof candidate.title === "string"
        && candidate.title.trim().length > 0
        && (candidate.description === undefined || typeof candidate.description === "string");
}
