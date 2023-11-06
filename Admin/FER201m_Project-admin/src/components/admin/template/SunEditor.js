import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import {
    align,
    font,
    fontColor,
    fontSize,
    formatBlock,
    hiliteColor,
    horizontalRule,
    lineHeight,
    list,
    paragraphStyle,
    table,
    template,
    textStyle,
    image,
    link,
} from 'suneditor/src/plugins';

export default function CustomEditor({
    id = '',
    name = '',
    onChange,
    setContents = '',
    placeholder = '',
    defaultValue = '',
}) {
    return (
        <SunEditor
            className="form-control"
            id={id}
            name={name}
            onChange={onChange}
            setContents={setContents}
            placeholder={placeholder}
            defaultValue={defaultValue}
            setOptions={{
                showPathLabel: false,
                minHeight: '50vh',
                maxHeight: '50vh',
                placeholder: 'Enter your text here!!!',
                plugins: [
                    align,
                    font,
                    fontColor,
                    fontSize,
                    formatBlock,
                    hiliteColor,
                    horizontalRule,
                    lineHeight,
                    list,
                    paragraphStyle,
                    table,
                    template,
                    textStyle,
                    image,
                    link,
                ],
                buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['paragraphStyle'],
                    [
                        'bold',
                        'underline',
                        'italic',
                        'strike',
                        'subscript',
                        'superscript',
                    ],
                    ['fontColor', 'hiliteColor'],
                    ['removeFormat'],
                    '/', // Line break
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link', 'image'],
                ],
                formats: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                font: [
                    'Arial',
                    'Calibri',
                    'Comic Sans',
                    'Courier',
                    'Garamond',
                    'Georgia',
                    'Impact',
                    'Lucida Console',
                    'Palatino Linotype',
                    'Segoe UI',
                    'Tahoma',
                    'Times New Roman',
                    'Trebuchet MS',
                ],
            }}
        />
    );
}
