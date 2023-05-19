import type { FunctionComponent, ReactNode } from 'react'
import React from 'react'

const hydratedValues: Record<string, boolean | undefined> = {}

const HydratingContext = React.createContext<null | boolean>(null)

export function useHydrated() {
	const value = React.useContext(HydratingContext)

	if (value === null) {
		throw new Error('Missing HydratingRoot context.')
	}

	return value
}

export const HydratingRoot: FunctionComponent<{ children: ReactNode }> = React.memo(
	function HydratingRoot(props) {
		const [index] = React.useState(() => {
			const g = global as { _hydratationIndex?: number }
			g._hydratationIndex = (g._hydratationIndex ?? 0) + 1
			return g._hydratationIndex
		})

		const [hydrated, setHydrated] = React.useState(() => hydratedValues[index] ?? false)

		React.useEffect(() => {
			const g = global as { _hydratationRecords?: Record<number, boolean> }
			const records = (g._hydratationRecords = g._hydratationRecords ?? {})
			records[index] = true
			setHydrated(true)
		}, [index])

		return <HydratingContext.Provider value={hydrated}>{props.children}</HydratingContext.Provider>
	}
)
