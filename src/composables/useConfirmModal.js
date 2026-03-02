import { ref, reactive } from 'vue'

const isOpen = ref(false)
const title = ref('Подтверждение')
const message = ref('Вы уверены, что хотите продолжить?')
const confirmText = ref('Подтвердить')
const cancelText = ref('Отмена')
const variant = ref('danger')

let _resolve = null

/**
 * Composable для программного открытия ConfirmModal.
 *
 * // В любом месте приложения:
 * const { confirm } = useConfirmModal()
 * const ok = await confirm({ message: 'Удалить элемент?' })
 * if (ok) { ... }
 */
export function useConfirmModal() {
  /**
   * Открывает модальное окно и возвращает Promise<boolean>.
   * @param {Object} options
   * @param {string} [options.title]
   * @param {string} [options.message]
   * @param {string} [options.confirmText]
   * @param {string} [options.cancelText]
   * @param {'danger'|'primary'} [options.variant]
   * @returns {Promise<boolean>}
   */
  const confirm = (options = {}) => {
    title.value = options.title ?? 'Подтверждение'
    message.value = options.message ?? 'Вы уверены, что хотите продолжить?'
    confirmText.value = options.confirmText ?? 'Подтвердить'
    cancelText.value = options.cancelText ?? 'Отмена'
    variant.value = options.variant ?? 'danger'
    isOpen.value = true

    return new Promise((resolve) => {
      _resolve = resolve
    })
  }

  const onConfirm = (result) => {
    isOpen.value = false
    if (_resolve) {
      _resolve(result)
      _resolve = null
    }
  }

  const onClose = () => {
    onConfirm(false)
  }

  /** Пропсы для передачи в <ConfirmModal> */
  const modalProps = reactive({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    variant
  })

  return { confirm, modalProps, onConfirm, onClose, isOpen }
}
