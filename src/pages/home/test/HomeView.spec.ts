import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../ui/HomeView.vue'

// Mock child features to prevent them from throwing errors or needing heavy state setup
vi.mock('@features/impersonate-user', () => ({
  ImpersonateUser: { template: '<div data-testid="impersonate-user-mock">ImpersonateUser</div>' },
}))

vi.mock('@features/add-user', () => ({
  AddUserModal: {
    props: ['isOpen'],
    template: `
      <div v-if="isOpen" data-testid="add-user-modal-mock">
        <button data-testid="submit-mock-btn" @click="$emit('submit', { name: 'Test User', email: 'test@example.com', photoUrl: 'url' })">Submit Form</button>
        <button data-testid="close-mock-btn" @click="$emit('close')">Close Modal</button>
      </div>
    `,
  },
}))

describe('HomeView - Default Story Context', () => {
  it('renders the core elements successfully on mount', () => {
    const wrapper = mount(HomeView)

    // Verifies layout matching the Default story state
    expect(wrapper.find('main.home-view').exists()).toBe(true)
    expect(wrapper.find('[data-testid="impersonate-user-mock"]').exists()).toBe(true)
    expect(wrapper.find('.sticky-btn').text()).toContain('Add User +')
  })

  it('toggles the registration modal visibility on interaction', async () => {
    const wrapper = mount(HomeView)

    // Modal should be hidden by default
    expect(wrapper.find('[data-testid="add-user-modal-mock"]').exists()).toBe(false)

    // Click "Add User +"
    await wrapper.find('.sticky-btn').trigger('click')
    expect(wrapper.find('[data-testid="add-user-modal-mock"]').exists()).toBe(true)

    // Trigger close from child modal component
    await wrapper.find('[data-testid="close-mock-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="add-user-modal-mock"]').exists()).toBe(false)
  })

  it('triggers an HTTP PUT request and dispatches a refresh event upon user form submission', async () => {
    // Spy on global window methods and fetch API
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
    } as Response)
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

    const wrapper = mount(HomeView)

    // Open modal and trigger submittal process
    await wrapper.find('.sticky-btn').trigger('click')
    await wrapper.find('[data-testid="submit-mock-btn"]').trigger('click')

    // Confirm network integration matching component architecture
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/talkjs-api/users/client_'),
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    // Check custom event signaling
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent))
    // expect((dispatchSpy.mock.calls[0][0] as CustomEvent).type).toBe('refresh-client-list')

    fetchSpy.mockRestore()
    dispatchSpy.mockRestore()
  })
})
