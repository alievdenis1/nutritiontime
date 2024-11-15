import { ref, onMounted, onUnmounted, Ref } from 'vue'

export const useIntersectionObserver = (container: Ref<HTMLElement | null>) => {
    const isContainerVisible = ref(true)

    let observer: IntersectionObserver | null = null

    onMounted(() => {
        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                isContainerVisible.value = entry.isIntersecting
            })
        }, {
            root: null,
            threshold: 0.1
        })

        if (container.value) {
            observer.observe(container.value)
        }
    })

    onUnmounted(() => {
        if (observer && container.value) {
            observer.unobserve(container.value)
        }
    })

    return isContainerVisible
}