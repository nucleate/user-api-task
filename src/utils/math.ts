export const createIdGenerator = (startFrom: number): (() => number) => {
    let lastId = startFrom;
    return (): number => lastId++;
};

export const calculateAverage = (array: number[]) => {
    const sum = array.reduce(
        (accumulator, currentValue) => accumulator + currentValue
    );
    const average = sum / array.length;
    return average;
};
