/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export function append<T>(slice: Array<T>, ...elements): Array<T> {
    if (slice == undefined) {
        return elements;
    } else {
        slice.push.apply(slice, elements);
    }
    return slice;
}
export function sortAscending(slice) {
    slice.sort(function(a, b) {
        return a - b;
    });
}
export function sortDescending(slice) {
    slice.sort(function(a, b) {
        return b - a;
    });
}
