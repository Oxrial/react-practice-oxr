// import { ReactNode, createElement, forwardRef, useEffect, useImperativeHandle } from 'react'
// import { Form, Select } from 'antd'
// import type { OptionProps, BaseOptionType } from 'antd/es/select/index'
// const CommForm = forwardRef(
// 	(
// 		{
// 			name = 'commForm',
// 			forms = [],
// 			data = {},
// 			dialog = false,
// 			nonOperation = false,
// 			nonOk = false,
// 			nonReset = false,
// 			onFinish,
// 			okText,
// 			form$attrs = {},
// 			formItem$attrs = {}
// 		}: { [key in string]: object },
// 		ref
// 	) => {
// 		const [form] = Form.useForm()
// 		useImperativeHandle(ref, () => ({ getForm: () => form }))
// 		const layout = { labelCol: { style: { display: 'inline-block', width: 'auto' } } }
// 		const onReset = () => form.resetFields()
// 		useEffect(() => form.setFieldsValue(data), [])
// 		const components = {
// 			Select: ({ options = [], $attrs = {} }) =>
// 				createElement(
// 					Select,
// 					{ ...$attrs },
// 					options.map((op: BaseOptionType) =>
// 						createElement(Select.Option, { children: [], key: op.value, value: op.value }, op.label)
// 					) as ReactNode[]
// 				)
// 		}
// 		return <></>
// 	}
// )
