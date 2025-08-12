import type { FormInstance } from 'antd/es/form/Form'
import type { FormListOperation } from 'antd/es/form/FormList'
import type { ReactNode } from 'react'

interface OperationItem {
	key?: string | number
	label?: ReactNode
	render?: () => ReactNode
	[key: string]: any
}
type FormItemAttrs = {
	hidden?: boolean
	[key: string]: any
}
interface FormItemConfig {
	name: string
	label?: ReactNode
	type?: string
	rules?: any[]
	keyenter?: boolean
	$attrs?: Record<string, any>
	formItem$attrs?: FormItemAttrs
	render?: (name: string | number | (string | number)[], f: FormItemConfig) => ReactNode
	[key: string]: any
}
interface FormListMeta {
	errors: React.ReactNode[]
	warnings: React.ReactNode[]
}

interface EditFormItemProps {
	forms: FormItemConfig[]
	form: FormInstance
	formName?: string
	operations?: OperationItem[]
	inFormList?: boolean
	formItem$attrs?: {
		hiddenLabel?: boolean
		headerBar?: boolean
		bodyRowSufRender?: (operation: FormListOperation, meta: FormListMeta, name: number) => ReactNode
		bodySufRender?: (operation: FormListOperation, meta: FormListMeta) => ReactNode
		[key: string]: any
	}
}
export type { EditFormItemProps, FormItemConfig, OperationItem, FormListMeta }
