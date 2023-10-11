export function pullValuesMetric(value: string) {
    let metric = value.slice(-1)
    let fullMetric = metric == 'M' || 'B' ? metric + 'illions' : metric + 'rillions' 
    return fullMetric
}