import { buildPrefixReuslt } from '@/util'
import type { ReactNode } from 'react'

type BaseUseModalReturn = {
	open: boolean
	setOpen: (open: boolean) => void
	ModalTemplate: ReactNode
}
// prettier-ignore
type PrefixedUseModalReturn<Prefix extends string | undefined = undefined> = Prefix extends string
	? {
			[K in keyof Pick<
				BaseUseModalReturn,
				'open'
			> as `${Lowercase<Prefix>}${Capitalize<K>}`]: BaseUseModalReturn[K]
    } & {
			[K in keyof Pick<BaseUseModalReturn, 'setOpen'> as `set${Capitalize<Prefix>}${K extends `set${infer R}`
				? Capitalize<R>
				: never}`]: BaseUseModalReturn[K]
    } & {
			[K in keyof Pick<BaseUseModalReturn, 'ModalTemplate'> as `${Capitalize<Prefix>}ModalTemplate`]: JSX.Element
    }
	: BaseUseModalReturn
const useModal = <Prefix extends string | undefined = undefined>(
	$attrs: {
		prefix?: string
		maskClosable?: boolean
		[key: string]: any
	} = {},
	$slot: ReactNode
) => {
	const [open, setOpen] = useState(false)
	const ModalTemplate = (
		<AModal open={open} maskClosable={$attrs?.maskClosable} onCancel={() => setOpen(false)} {...$attrs}>
			{$slot}
		</AModal>
	)
	const result = {
		open,
		setOpen,
		ModalTemplate
	}
	const prefix = $attrs?.prefix ? `_${$attrs.prefix}_` : ''
	if (prefix) {
		return buildPrefixReuslt(
			prefix,
			result,
			['open'],
			['setOpen'],
			'ModalTemplate'
		) as PrefixedUseModalReturn<Prefix>
	}
	return result as PrefixedUseModalReturn<Prefix>
}
export default useModal
