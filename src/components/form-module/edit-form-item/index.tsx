import { omit } from 'lodash-es'
import COMPONENTS from '@/components'

const ATTR_KEYS = ['options', 'onPressEnter']
const EditFormItem = ({
	form,
	formName = 'edit',
	forms,
	operations = [],
	inFormList = false,
	formItem$attrs = {}
}: {
	forms: Record<string, any>[]
	form: any
	formName: string
	operations?: Record<string, any>[]
	inFormList?: boolean
	formItem$attrs?: Record<string, any>
}) => {
	const formItemRender = (_f, name, key) => {
		const { type = 'Input' } = _f
		ATTR_KEYS.forEach((k) => {
			if (k in _f) {
				if (!('$attrs' in _f)) _f.$attrs = {}
				if (!(k in _f.$attrs)) _f.$attrs[k] = _f[k]
				delete _f[k]
			}
		})
		const keyenter = _f.keyenter ?? false
		if (keyenter) {
			if (!('$attrs' in _f)) _f.$attrs = {}
			switch (type) {
				case 'Select':
					_f.$attrs.onPressEnter = () => {
						form.submit()
					}
					break
				case 'Input':
					_f.$attrs.onPressEnter = () => {
						form.submit()
					}
					break
			}
		}
		const label = formItem$attrs.hiddenLabel ? '' : _f.label
		return (
			<AForm.Item
				label={label}
				name={name}
				key={key}
				rules={_f?.formItem$attrs?.hidden == true ? undefined : _f.rules}
				{...omit(formItem$attrs, 'hiddenLabel', 'headerBar')}
				{..._f?.formItem$attrs}
			>
				{type === 'Custom' ? _f?.render(name, _f) : COMPONENTS[type](omit(_f, 'formItem$attrs'))}
			</AForm.Item>
		)
	}
}
