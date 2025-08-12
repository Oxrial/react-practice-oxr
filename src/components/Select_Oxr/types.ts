interface SelectOxrProps {
	options?: Record<string, any>[]
	fieldNames?: { label: string | string[]; value: string }
	optionClassName?: string
	rightRender?: (option: Record<string, any>) => React.ReactNode
	allowCreate?: boolean
	mode?: 'multiple' | 'tags'
	value?: any // 表单传入的值
	onChange?: (value: any, option?: any) => void // 表单 onChange
	[key: string]: any
}
export type { SelectOxrProps }
