const menuButton = document.querySelector('.menu-button')
const navigation = document.querySelector('.main-navigation')

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true'
    menuButton.setAttribute('aria-expanded', String(!isOpen))
    menuButton.querySelector('.sr-only').textContent = isOpen ? 'Abrir menu' : 'Fechar menu'
    navigation.classList.toggle('is-open', !isOpen)
  })
}

const listingKind = document.querySelector('[data-listing-kind]')
const conditionalFields = document.querySelectorAll('[data-fields]')

if (listingKind && conditionalFields.length) {
  const updateFields = () => {
    conditionalFields.forEach((group) => {
      group.hidden = group.dataset.fields !== listingKind.value
    })
  }
  listingKind.addEventListener('change', updateFields)
  updateFields()
}

document.querySelectorAll('[data-confirm]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    if (!window.confirm(form.dataset.confirm)) event.preventDefault()
  })
})
