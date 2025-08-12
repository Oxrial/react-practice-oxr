import { omit } from 'lodash-es'
import COMPONENTS from '@/components'
import type { EditFormItemProps, FormItemConfig } from './types'

const ATTR_KEYS = ['options', 'onPressEnter']

const EditFormItem = ({
	form,
	formName = 'edit',
	forms,
	operations = [],
	inFormList = false,
	formItem$attrs = {}
}: EditFormItemProps) => {
	const formItemRender = (_f: FormItemConfig, name: string | any[] | number, key: string | number) => {
		const { type = 'Input' } = _f
		ATTR_KEYS.forEach((k) => {
			if (k in _f) {
				if (!('$attrs' in _f)) _f.$attrs = {}
				if (_f.$attrs) {
					if (!(k in _f.$attrs)) _f.$attrs[k] = _f[k]
					delete _f[k]
				}
			}
		})
		const keyenter = _f.keyenter ?? false
		if (keyenter) {
			if (!('$attrs' in _f)) _f.$attrs = {}
			if (_f.$attrs) {
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
		}
		const label = formItem$attrs.hiddenLabel ? '' : _f.label
		return (
			<AForm.Item
				label={label}
				name={name}
				key={key}
				rules={_f?.formItem$attrs?.hidden == true ? undefined : _f.rules}
				{...omit(formItem$attrs, 'hiddenLabel', 'headerBar', 'bodyRowSufRender', 'bodySufRender')}
				{..._f?.formItem$attrs}
			>
				{type === 'Custom'
					? 'render' in _f && typeof _f.render === 'function' && _f.render(name, _f)
					: COMPONENTS[type](omit(_f, 'formItem$attrs'))}
			</AForm.Item>
		)
	}
	return (
		<>
			{!inFormList ? (
				<>
					{forms.map((f) => formItemRender(f, f.name, f.name))}
					{!!operations.length && (
						<AForm.Item>
							<div className="module-form-operation">
								{operations.map((f, findex) =>
									'render' in f && typeof f.render === 'function' ? (
										f.render()
									) : (
										<AButton {...f} key={f.key || findex}>
											{f.label}
										</AButton>
									)
								)}
							</div>
						</AForm.Item>
					)}
				</>
			) : (
				<div className="module-form-list">
					<AForm.List name={formName}>
						{(fields, operation, meta) => (
							<>
								{formItem$attrs?.headerBar && (
									<div className="module-form-list-row header">
										{forms.map((f) => (
											<AForm.Item key={'header_' + f.name}>{f.label}</AForm.Item>
										))}
									</div>
								)}
								<div className="module-form-list-body">
									{fields.map(({ key, name }) => (
										<div className="module-form-list-row" key={key}>
											{forms.map((f) => formItemRender(f, [name, f.name], `${name}_${f.name}`))}
											{'bodyRowSufRender' in formItem$attrs &&
												typeof formItem$attrs.bodyRowSufRender === 'function' &&
												formItem$attrs?.bodyRowSufRender(operation, meta, name)}
										</div>
									))}
									{!!operations.length && (
										<AForm.Item>
											<div className="module-fofrm-operation">
												{operations.map((f, findex) =>
													'render' in f && typeof f.render === 'function' ? (
														f.render()
													) : (
														<AButton {...f} key={f.key || findex}>
															{f.label}
														</AButton>
													)
												)}
											</div>
										</AForm.Item>
									)}
									{'bodySufRender' in formItem$attrs &&
										typeof formItem$attrs.bodySufRender === 'function' &&
										formItem$attrs?.bodySufRender(operation, meta)}
								</div>
							</>
						)}
					</AForm.List>
				</div>
			)}
		</>
	)
}
export default EditFormItem
