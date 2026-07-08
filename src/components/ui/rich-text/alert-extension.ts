import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const Alert = Node.create({
    name: 'alert',

    group: 'block',

    content: 'block+',

    draggable: true,

    addAttributes() {
        return {
            type: {
                default: 'note',
                parseHTML: element => element.getAttribute('data-alert-type'),
                renderHTML: attributes => {
                    return { 'data-alert-type': attributes.type }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-alert-type]',
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        const type = node.attrs.type // note, warning, tip, caution
        let classes = "my-4 p-4 rounded-r-lg border-l-4 [&>p]:my-0"

        // Tailwind classes baked in
        if (type === 'note') classes += " bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950/30 dark:border-blue-500 dark:text-blue-200"
        if (type === 'tip') classes += " bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-200"
        if (type === 'warning') classes += " bg-amber-50 border-amber-500 text-amber-900 dark:bg-amber-950/30 dark:border-amber-500 dark:text-amber-200"
        if (type === 'caution') classes += " bg-red-50 border-red-500 text-red-900 dark:bg-red-950/30 dark:border-red-500 dark:text-red-200"

        return ['div', mergeAttributes(HTMLAttributes, { class: classes, 'data-alert-type': type }), 0]
    },

    addStorage() {
        return {
            markdown: {
                serialize(state: any, node: any) {
                    const type = node.attrs.type

                    // Construct the HTML string with Tailwind classes
                    let classes = "my-4 p-4 rounded-r-lg border-l-4 [&>p]:my-0"
                    if (type === 'note') classes += " bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950/30 dark:border-blue-500 dark:text-blue-200"
                    if (type === 'tip') classes += " bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-200"
                    if (type === 'warning') classes += " bg-amber-50 border-amber-500 text-amber-900 dark:bg-amber-950/30 dark:border-amber-500 dark:text-amber-200"
                    if (type === 'caution') classes += " bg-red-50 border-red-500 text-red-900 dark:bg-red-950/30 dark:border-red-500 dark:text-red-200"

                    state.write(`<div class="${classes}" data-alert-type="${type}">`)
                    state.renderContent(node)
                    state.write('</div>')
                    state.closeBlock(node)
                },
                parse: {
                    // We don't strictly need a markdown parser hook because we want it to stay as HTML
                    // However, if we wanted to support reading back standard markdown alerts, we would do it here.
                    // For now, let's treat it as HTML block.
                }
            }
        }
    }
})

export default Alert
