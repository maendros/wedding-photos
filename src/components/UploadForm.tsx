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
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            
            <input 
                id="file" 
                name="file" 
                type="file" 
                onChange={(event) => {
                    const file = event.currentTarget.files ? event.currentTarget.files[0] : null
                    formik.setFieldValue('file', file)
                    setUploadedFile(file)
                }}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {formik.errors.file ? <div className="text-red-600">{formik.errors.file}</div> : null}
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Upload Photo</button>
        </form>
    )
}

export default UploadForm
