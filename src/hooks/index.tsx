export { default as useTable } from './useTable'
export { default as useForm } from './useForm'
export { default as useModal } from './useModal'
const useComputedRef = (_value: any, effectCallback?: () => void) => {
	const valueRef = useRef(_value)
	useEffect(() => {
		valueRef.current = _value
		effectCallback && effectCallback()
	}, [_value, effectCallback])
	return valueRef
}
export { useComputedRef }
