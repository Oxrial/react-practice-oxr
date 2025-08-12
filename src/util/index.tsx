import { camelCase, upperFirst } from 'lodash-es'

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

// 在字符串指定位置插入新字符串
const insertStr = (soure: string, start: number, newStr: string) => {
	return soure.slice(0, start) + newStr + soure.slice(start)
}

const buildPrefixReuslt = (
	prefix: string,
	result: { [key: string]: any },
	baseKeys: readonly string[],
	setterKeys: readonly string[],
	templateKey: string
) => {
	const prefixedResult: any = {}

	// 处理基础属性 (小驼峰)
	baseKeys.forEach((k) => {
		const newKey = camelCase(prefix + k)
		prefixedResult[newKey] = result[k]
	})

	// 处理 setter 方法 (大驼峰)
	setterKeys.forEach((k) => {
		const newKey = camelCase(insertStr(k, 3, prefix))
		prefixedResult[newKey] = result[k]
	})

	// 处理 TableTemplate (大驼峰)
	prefixedResult[upperFirst(camelCase(prefix + templateKey))] = result[templateKey]

	// 使用类型断言确保返回正确的带前缀类型
	return prefixedResult
}
export { ato, ota, insertStr, buildPrefixReuslt }
export default { ato, ota, insertStr, buildPrefixReuslt }
