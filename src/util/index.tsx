// array to object
const ato = (arr: any[] = [], start = 0) => {
	return arr.reduce((acc, cur, index) => {
		acc[index + start] = cur
		return acc
	}, {} as Record<number, any>)
}
// object to array
const ota = (obj: Record<string, any> = {}, kprop = 'label', vprop = 'value') =>
	Object.entries(obj).map(([key, value]) => ({
		[kprop]: key,
		[vprop]: value
	}))
// const COMPONENTS = {
//     Select:(f) =>
// }
export default { ato, ota }
