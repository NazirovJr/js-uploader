function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

function elementDC(tag, classes = [], contentText) {
    const node = document.createElement(tag)
    if (classes.length){
        node.classList.add(...classes)
    }
    if (contentText){
        node.textContent = contentText
    }

    return node
}
const noop = function () {}

export function upload(selector, opinions = {}) {
    let files = []
    const onUpload = opinions.onUpload ? opinions.onUpload :noop
    const input = document.querySelector(selector)
    const openButton = elementDC('button', ['btn'], 'открыть')
    const preview = elementDC('div', ['preview'])
    const uploadButton = elementDC('button', ['btn', 'primary'], 'Загрузить')
    const removeAllButton = elementDC('button', ['btn', 'primary'], 'Очистить')
    uploadButton.style.display = 'none';
    removeAllButton.style.display = 'none';

    input.insertAdjacentElement("afterend", preview)
    input.insertAdjacentElement("afterend", uploadButton)
    input.insertAdjacentElement("afterend", removeAllButton)
    input.insertAdjacentElement("afterend", openButton)


    const triggerInput = () => input.click()

    if (opinions.multi) {
        input.setAttribute('multiple', true)
    }

    if (opinions.accept && Array.isArray(opinions.accept)) {
        input.setAttribute('accept', opinions.accept.join(','))
    }

    const handlerChange = event => {
        if (!event.target.files.length) {
            return
        }

        files = Array.from(event.target.files)
        preview.innerHTML = ``
        uploadButton.style.display = 'inline'
        removeAllButton.style.display = 'inline'

        files.forEach(file => {
            if (!file.type.match('image')) {
                return
            }
            const reader = new FileReader()

            reader.onload = ev => {
                const src = ev.target.result
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                    <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${src}" alt="${file.name}">
                        <div class="preview-info">
                            <span>${file.name}</span>
                            ${bytesToSize(file.size)}
                        </div>
                    </div>
                `)
            }

            reader.readAsDataURL(file)
        })
    }
    const handlerRemove = event => {
        if (!event.target.dataset.name){
            return
        }

        const {name} = event.target.dataset
        files = files.filter(el => el.name !== name)

        if (!files.length){
            uploadButton.style.display = 'none'
            removeAllButton.style.display = 'none'
        }

        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image')
        block.classList.add('removing')
        setTimeout(() => block.remove(),300)
    }

    const clearPreview = element => {
        element.style.bottom = '4px'
        element.innerHTML = `<div class="preview-info-progress"></div>`
    }

    function uploadHandler (event) {
        preview.querySelectorAll('.preview-remove').forEach(el => el.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)
        onUpload(files, previewInfo)
    }

    openButton.addEventListener('click', triggerInput)
    input.addEventListener('change', handlerChange)
    preview.addEventListener('click',handlerRemove)
    uploadButton.addEventListener('click', uploadHandler)
    removeAllButton.addEventListener('click', () =>{
        files = []
        uploadButton.style.display = 'none'
        removeAllButton.style.display = 'none'
        const blocks = preview.querySelectorAll(`.preview-image`)
        blocks.forEach(block => {
            block.classList.add('removing')
            setTimeout(() => block.remove(),300)
        })
    })
}