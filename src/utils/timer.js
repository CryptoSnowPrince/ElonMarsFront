export function showMinutes(seconds) {
    let min = Math.ceil(seconds/60);

    return "Min:"+min;
}

export function showHours(seconds) {
    let hr = Math.ceil(seconds/3600);

    return hr + " Hours";
}