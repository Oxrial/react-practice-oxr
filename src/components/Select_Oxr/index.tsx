import React, { useState, useEffect, useRef } from 'react'
import { pick, omit } from 'lodash-es'
import { Select as ASelect } from 'antd'
import type { SelectOxrProps } from './types'

const Select_Oxr = ({
	options = [],
	fieldNames = { label: 'label', value: 'value' },
	optionClassName = '',
	rightRender,
	allowCreate = false,
	mode,
	value,
	onChange,
	...rest
}: SelectOxrProps) => {
	const oLabel = Array.isArray(fieldNames.label) ? fieldNames.label : [fieldNames.label]
	const oValue = fieldNames.value
	const [innerOptions, setInnerOptions] = useState(options)
	const [searchValue, setSearchValue] = useState('')
	const inputRef = useRef<any>(null)
	const isComposingRef = useRef(false)

	useEffect(() => {
		setInnerOptions(options)
	}, [options])

	// 保证受控 value 与表单同步
	// 不再维护内部 value 状态，直接用 props.value

	const innerOnSearch = (val: string) => {
		console.log('onSearch', val, isComposingRef.current)
		setSearchValue(val)
		if (!isComposingRef.current && 'onSearch' in rest) {
			rest.onSearch(val, setInnerOptions)
		}
	}
	const start = () => (isComposingRef.current = true)
	const end = () => {
		isComposingRef.current = false
		const v = inputRef.current?.value
		v && innerOnSearch(v)
	}
	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		const input = e.target as HTMLInputElement
		if (input && !inputRef.current) {
			input.addEventListener('compositionstart', start)
			input.addEventListener('compositionend', end)
			// 将ref赋值为当前input元素，防止onsearch的键入覆盖
			// abc异常接接收为a b c，保证为a ab abc
			inputRef.current = input
		}
	}
	const handleBlur = () => {
		if (inputRef.current) {
			inputRef.current.removeEventListener('compositionstart', start)
			inputRef.current.removeEventListener('compositionend', end)
			inputRef.current.removeEventListener('input', () => {})
		}
	}
	const renderLabel = (option: Record<string, any>) =>
		oLabel.slice(1).reduce((l, k) => l + (option[k] === '' ? '' : ' - ' + option[k]), option[oLabel[0]] || '')
	const renderOptions = (options: Record<string, any>[]) =>
		options.map((op) => ({ value: op[oValue], label: renderLabel(op), ...pick(op, ['disabled']) }))

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			allowCreate &&
			mode === 'multiple' &&
			e.key === 'Enter' &&
			searchValue &&
			!innerOptions.some((op) => op[oValue] === searchValue)
		) {
			const newOption = { [oValue]: searchValue, [oLabel[0]]: searchValue }
			setInnerOptions([...innerOptions, newOption])
			// 直接同步到表单
			const newValue = Array.isArray(value) ? [...value, searchValue] : [searchValue]
			onChange?.(newValue)
			setSearchValue('')
			e.preventDefault()
		}
	}
	// 过滤选项
	const selectOptions = renderOptions(innerOptions).filter((op) =>
		searchValue ? op.label.includes(searchValue) : true
	)
	// 多选模式下，输入内容不在 options 里时，自动添加
	if (allowCreate && mode === 'multiple' && searchValue) {
		const exists = selectOptions.some((op) => op.value === searchValue)
		if (!exists) {
			selectOptions.unshift({
				disabled: false,
				value: searchValue,
				label: searchValue
			})
		}
	}

	return (
		<ASelect
			{...omit(rest, 'keyenter')}
			showSearch
			filterOption={!('onSearch' in rest)}
			onSearch={innerOnSearch}
			onSelect={(v, option) => {
				'onSelect' in rest &&
					rest.onSelect(
						v,
						innerOptions.find((op) => op[oValue] === option.value)
					)
				'onPressEnter' in rest && rest.onPressEnter()
			}}
			onClear={() => 'keyenter' in rest && rest.keyenter && 'onPressEnter' in rest && rest.onPressEnter()}
			onFocus={handleFocus}
			onBlur={handleBlur}
			mode={mode}
			value={value}
			onChange={onChange}
			dropdownRender={(menu) => <div onKeyDown={handleInputKeyDown}>{menu}</div>}
		>
			{selectOptions.map((op, index) => (
				<ASelect.Option key={op.value || index} value={op.value || index} className={optionClassName}>
					<span>{op.label}</span>
					{rightRender && rightRender(op)}
				</ASelect.Option>
			))}
		</ASelect>
	)
}
export default Select_Oxr
