"use client"

// import { Editor } from '@tinymce/tinymce-react';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('@tinymce/tinymce-react').then((mod) => mod.Editor), { ssr: false });
import { useEffect, useRef, useState } from 'react';
// TinyMCE so the global var exists
import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model'
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin';

// importing the plugin js.
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
// import 'tinymce/plugins/autoresize';
// import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/help/js/i18n/keynav/en';
import 'tinymce/plugins/image';
// import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
// import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// Content styles, including inline UI like fake cursors
import 'tinymce/skins/content/default/content';
import 'tinymce/skins/ui/oxide/content';

export default function BlogEditor({ onContentChanges, initValue }) {
    const [content, setContent] = useState('')
    const [temp, setTemp] = useState('')

    useEffect(() => {
        console.log(temp)
    }, [temp])

    return (
        <>
            <Editor
                // initialValue={initValue}
                value={initValue}
                onEditorChange={(content, editor) => {
                    // seTemp(content)
                    // console.log(content)
                    onContentChanges(content)
                }}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'anchor', 'autolink', 'code', 'codesample', 'charmap', 'emoticons', 'fullscreen', 'help',
                        'image', 'insertdatetime', 'link', 'lists', 'media', 'preview', 'searchreplace',
                        'table', 'visualchars', 'visualblocks', 'wordcount',
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic underline forecolor backcolor|' +
                        'alignleft aligncenter alignright alignjustify|' +
                        'bullist numlist outdent indent|' +
                        'emoticons charmap|' +
                        'link image media table hr|' +
                        ' searchreplace removeformat|' +
                        'quickbars preview fullscreen| help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    license_key: 'gpl',
                    branding: false,
                    statusbar: false,
                    // quickbars_selection_toolbar: 'bold italic forecolor backcolor| quicklink h2 h3 blockquote emoticons',
                    automatic_uploads: true,
                    images_reuse_filename: false,
                    help_tabs: ['shortcuts', 'keyboardnav'],

                    images_upload_url: `/api/uploadImg?path=blogs`, // URL for handling image uploads
                }}

            />
        </>
    );
}

export function AllConfigEditor(props) {
    const [content, setContent] = useState('')
    const [temp, setTemp] = useState('')
    const editorRef = useRef(null);
    // const log = () => {
    //     if (editorRef.current) {
    //         console.log(editorRef.current.getContent());
    //         setContent(editorRef.current.getContent())
    //     }
    // };

    useEffect(() => {
        console.log(temp)
    }, [temp])

    return (
        <>
            <Editor
                // onInit={(_evt, editor) => {
                //     editorRef.current = editor
                //     seTemp(editor.getContent())
                // }}
                initialValue=''
                onEditorChange={(content, editor) => {
                    // seTemp(content)
                    // console.log(content)
                }}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'anchor', 'autolink', 'code', 'codesample', 'charmap', 'emoticons', 'fullscreen', 'help',
                        'image', 'insertdatetime', 'link', 'lists', 'media', 'preview', 'quickbars', 'searchreplace',
                        'table', 'visualchars', 'visualblocks', 'wordcount',
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor backcolor blockquote|' +
                        'alignleft aligncenter alignright alignjustify|' +
                        'visualchars visualblocks|' +
                        'bullist numlist outdent indent|' +
                        'emoticons charmap| insertdatetime' +
                        'link image media table hr|' +
                        ' code codesample searchreplace removeformat|' +
                        ' quickbars preview fullscreen| help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    license_key: 'gpl',
                    branding: false,
                    statusbar: false,
                    quickbars_selection_toolbar: 'bold italic forecolor backcolor| quicklink h2 h3 blockquote emoticons',
                    automatic_uploads: true,
                    help_tabs: ['shortcuts', 'keyboardnav'],

                    // file_picker_types: 'image',
                    // file_picker_callback: (cb, value, meta) => {
                    //     const input = document.createElement('input');
                    //     input.setAttribute('type', 'file');
                    //     input.setAttribute('accept', 'image/*');

                    //     input.addEventListener('change', (e) => {
                    //         const file = e.target.files[0];

                    //         const reader = new FileReader();
                    //         reader.addEventListener('load', () => {
                    //             const id = 'blobid' + (new Date()).getTime();
                    //             const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    //             const base64 = reader.result.split(',')[1];
                    //             const blobInfo = blobCache.create(id, file, base64);
                    //             blobCache.add(blobInfo);
                    //             cb(blobInfo.blobUri(), { title: file.name });
                    //         });
                    //         reader.readAsDataURL(file);
                    //     });

                    //     input.click();
                    // },
                    // images_upload_url: `${import.meta.env.VITE_BASE_URL}/upload`, // URL for handling image uploads
                }}

            />
            {/* <button onClick={log}>Log editor content</button> */}
            {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
        </>
    );
}