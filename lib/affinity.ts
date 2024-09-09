export function getIntersection(set1: number[], set2: number[]) {
    const intersection: number[] = []

    for (const element of set1) {
        if (set2.includes(element)) {
            intersection.push(element)
        }
    }

    return intersection
}

export function getAffinity(set1: number[], set2: number[]) {
    const intersection = getIntersection(set1, set2)

    return intersection.length / Math.min(set1.length, set2.length)
}
