import type { ReactNode } from 'react'
import { EditFormItem } from '@/components/form-module'
import { buildPrefixReuslt } from '@/util'
import type { FormInstance } from 'antd'
type FormItemConfig = {
	name: string
	label?: ReactNode
	type?: string
	$attrs?: Record<string, any>
	options?: Record<string, any>[]
}
interface OperationItem {
	key?: string | number
	label?: ReactNode
	render?: () => ReactNode
	[key: string]: any
}
type BaseUseFormReturn = {
	form: FormInstance
	data: object
	setData: (data: object) => void
	forms: FormItemConfig[]
	setForms: (forms: FormItemConfig[]) => void
	operations: OperationItem[]
	setOperations: (operations: OperationItem[]) => void
	FormTemplate: JSX.Element
}
// prettier-ignore
type PrefixedUseFormReturn<Prefix extends string | undefined = undefined> = Prefix extends string
	? {
			[K in keyof Pick<
				BaseUseFormReturn,
				'form' | 'data' | 'forms' | 'operations'
			> as `${Lowercase<Prefix>}${Capitalize<K>}`]: BaseUseFormReturn[K]
	} & {
			[K in keyof Pick<
				BaseUseFormReturn,
				'setData' | 'setForms' | 'setOperations'
			> as `set${Capitalize<Prefix>}${K extends `set${infer R}` ? Capitalize<R> : never}`]: BaseUseFormReturn[K]
	} & {
			[K in keyof Pick<BaseUseFormReturn, 'FormTemplate'> as `${Capitalize<Prefix>}FormTemplate`]: JSX.Element
	}
	: BaseUseFormReturn

interface UseFormAttrs {
	[key: string]: any
}
const useForm = <Prefix extends string | undefined = undefined>(
	_forms: any[],
	_data: object,
	$attrs: UseFormAttrs & { prefix?: Prefix } = {},
	_operations?: any[]
) => {
	const [form] = AForm.useForm()
	const [data, setData] = useState(_data || {})
	const [forms, setForms] = useState(_forms || [])
	const [operations, setOperations] = useState(_operations || [])
	useEffect(() => {
		form.setFieldsValue({ ...data })
	}, [data, form])
	const FormTemplate = (
		<AForm form={form} {...$attrs}>
			<EditFormItem forms={forms} form={form} operations={operations} />
		</AForm>
	)
	const result = {
		FormTemplate,
		form,
		data,
		setData,
		forms,
		setForms,
		operations,
		setOperations
	}
	const prefix = $attrs?.prefix ? `_${$attrs.prefix}_` : ''
	if (prefix) {
		const baseKeys = ['form', 'data', 'forms', 'operations'] as const
		const setterKeys = ['setData', 'setForms', 'setOperations'] as const
		return buildPrefixReuslt(prefix, result, baseKeys, setterKeys, 'FormTemplate') as PrefixedUseFormReturn<Prefix>
	}
	return result as PrefixedUseFormReturn<Prefix>
}
export default useForm
