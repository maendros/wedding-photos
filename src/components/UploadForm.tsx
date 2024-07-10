import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

interface UploadFormProps {
    setUploadedFile: (file: File | null) => void
    setFileUrl: (url: string | null) => void
}

interface FormValues {
    file: File | null
}

const UploadForm: React.FC<UploadFormProps> = ({ setUploadedFile, setFileUrl }) => {
    const formik = useFormik<FormValues>({
        initialValues: {
            file: null
        },
        validationSchema: Yup.object({
            file: Yup.mixed().required('A file is required')
        }),
        onSubmit: async (values) => {
            if (values.file) {
                const formData = new FormData()
                formData.append('file', values.file, values.file.name)
                
                try {
                    const response = await axios.post('/api/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    setFileUrl(response.data.url)
                } catch (error) {
                    console.error('Error uploading file', error)
                }
            }
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <input 
                id="file" 
                name="file" 
                type="file" 
                onChange={(event) => {
                    const file = event.currentTarget.files ? event.currentTarget.files[0] : null
                    formik.setFieldValue('file', file)
                    setUploadedFile(file)
                }}
            />
            {formik.errors.file ? <div>{formik.errors.file}</div> : null}
            <button type="submit">Upload Photo</button>
        </form>
    )
}

export default UploadForm
