<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	interface BaseColumn {
		label: string;
		style?: string;
		order?: (dir: string) => [];
	}
	interface GetterColumn extends BaseColumn {
		getter: any;
	}
	interface ComponentColumn extends BaseColumn {
		component: unknown;
		props: unknown;
	}
	type Column = string | BaseColumn | GetterColumn | ComponentColumn;

	export let columns: Column[];
	export let data: any[][];
	export let key: string;

	export let order: {
		column: string;
		direction: 'asc' | 'desc';
	};

	// Assign classes to rows based on conditions
	export let rowClass = null;

	const sort = (column: Column) => {
		console.log(column);
		if (!column.order) return;

		if (order?.column === column.label) {
			order.direction = order.direction === 'asc' ? 'desc' : 'asc';
		} else {
			order = { column: column.label, direction: 'asc' };
		}
	};
</script>

<table>
	<thead>
		<tr>
			{#each columns as column (column)}
				<th on:click={() => sort(column)}>
					{column.label ?? column}
					<span class="icon">
						{#if order?.column === column.label}
							{#if order.direction === 'asc'}
								arrow_drop_down
							{:else}
								arrow_drop_up
							{/if}
						{/if}
					</span>
				</th>
			{/each}
		</tr>
	</thead>

	<tbody>
		{#each data as row (row[key])}
			<tr
				on:click={() => dispatch('click', row)}
				on:mouseover={() => dispatch('focus', row)}
				on:focus={() => dispatch('focus', row)}
				class={rowClass &&
					Object.entries(rowClass(row))
						.filter(([cls, enabled]) => enabled)
						.map(([cls]) => cls)
						.join(' ')}
			>
				{#each columns as column (column)}
					<td style={column.style}>
						{#if column.getter}
							{column.getter(row)}
						{:else if column.component}
							<svelte:component this={column.component} {...column.props(row)} />
						{:else}
							{row[column]}
						{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
		width: 100%;
		width: calc(100% + 16px);
		margin: 8px -8px;
		box-sizing: border-box;
	}

	thead {
		position: sticky;
		top: 0;
		background: var(--gray);
		box-shadow: 0 2px var(--black);
		text-align: left;
		z-index: 10;
	}

	th {
		padding: 0.5rem 0.2rem;
		font-weight: bold;
		position: sticky;
	}

	th:first-child,
	td:first-child {
		padding-left: max(env(safe-area-inset-left), 8px);
	}

	th:last-child,
	td:last-child {
		padding-right: max(env(safe-area-inset-right), 8px);
	}

	@media (hover: hover) {
		tbody tr {
			transition: background 0.6s ease-out;
		}

		tbody tr:hover {
			background: var(--gray-light);
		}
	}
</style>
