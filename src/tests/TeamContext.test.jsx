import { render, screen, fireEvent } from '@testing-library/react'
import { TeamProvider, useTeam } from '../context/TeamContext'

function Probe() {
  const { selectedTeam, selectTeam, clearTeam } = useTeam()
  return (
    <div>
      <span data-testid="name">{selectedTeam?.name ?? 'none'}</span>
      <button onClick={() => selectTeam({ name: 'South Korea', flag: '🇰🇷', group: 'A', countryId: 1 })}>
        select
      </button>
      <button onClick={clearTeam}>clear</button>
    </div>
  )
}

test('selectedTeam starts null', () => {
  render(<TeamProvider><Probe /></TeamProvider>)
  expect(screen.getByTestId('name').textContent).toBe('none')
})

test('selectTeam updates selectedTeam', () => {
  render(<TeamProvider><Probe /></TeamProvider>)
  fireEvent.click(screen.getByText('select'))
  expect(screen.getByTestId('name').textContent).toBe('South Korea')
})

test('clearTeam resets to null', () => {
  render(<TeamProvider><Probe /></TeamProvider>)
  fireEvent.click(screen.getByText('select'))
  fireEvent.click(screen.getByText('clear'))
  expect(screen.getByTestId('name').textContent).toBe('none')
})
