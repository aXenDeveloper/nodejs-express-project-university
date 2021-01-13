import { useEffect, useState, createRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useCSRF } from '../../../context/csrf';
import useIngredientsForm from '../../../hooks/useIngredientsForm';
import useRecipeForm from '../../../hooks/useRecipeForm';
import config from '../../../config';

import IngredientsForm from '../../../components/recipes/IngredientsForm';
import Loading from '../../../components/Loading';
import CategoryList from '../../../components/recipes/CategoryList';
import Breadcrumb from '../../../components/Breadcrumb';

const RecipesAddView = () => {
	const { inputTitle, inputCategory, inputDesc, handleTitle, handleCategory, setInputDesc } = useRecipeForm();

	const {
		inputingredient,
		listIngredients,
		removeIngredient,
		upadateIngredient,
		addIngredient,
		handleInput
	} = useIngredientsForm();

	const [inputImage, setInputImage] = useState({});
	const [errorMessageFile, setErrorMessageFile] = useState('');

	useEffect(() => {
		document.title = `${config.title_page} - Add Recipe`;
	}, []);

	const { register, handleSubmit, errors } = useForm();
	const queryClient = useQueryClient();
	const fileInput = createRef();
	const history = useHistory();
	const { tokenCSRF } = useCSRF();

	const { mutateAsync, isLoading } = useMutation(async () => {
		const formData = new FormData();
		formData.append('productImage', inputImage);
		formData.append('title', inputTitle);
		formData.append('category', inputCategory);
		formData.append('ingredients', JSON.stringify(listIngredients));
		formData.append('description', inputDesc);

		const api = await fetch(`${config.backend_url}/recipes/add`, {
			method: 'POST',
			headers: {
				CSRF_Token: tokenCSRF
			},
			body: formData
		});
		const data = await api.json();

		if (api.status === 200) {
			history.push(`/recipes/${data.recipe_id}`);
		}

		console.log(data);

		return data;
	});

	const onSubmit = async data => {
		setErrorMessageFile('');

		if (data.image[0].type === 'image/jpeg' || data.image[0].type === 'image/png') {
			await mutateAsync();
			queryClient.invalidateQueries('recipeList');
		} else {
			setErrorMessageFile('The file is not a Image!');
		}
	};

	const handleImage = e => setInputImage(e.target.files[0]);

	if (isLoading) return <Loading />;

	return (
		<form className="form container container:medium" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
			<Breadcrumb>Add</Breadcrumb>

			<div className="container_box padding">
				<ul className="form_ul">
					<li>
						<label htmlFor="title" className="input_label">
							Title
						</label>
						<input
							type="text"
							name="title"
							id="title"
							className={`input input_text input_full${errors.title ? ' input_error' : ''}`}
							onChange={handleTitle}
							ref={register({ required: true })}
						/>
					</li>

					<li>
						<label htmlFor="category" className="input_label">
							Category
						</label>
						<select
							id="category"
							name="category"
							onChange={handleCategory}
							className="input input_select input_full"
							ref={register({ required: true })}
						>
							<CategoryList />
						</select>
					</li>

					<li>
						<label htmlFor="image" className="input_label">
							Image
						</label>
						<input
							type="file"
							name="image"
							className={`input input_file input_full${errors.image ? ' input_error' : ''}`}
							id="image"
							onChange={handleImage}
							accept="image/x-png,image/gif,image/jpeg"
							ref={register({ required: true, fileInput })}
						/>

						{errorMessageFile && <div className="message message-error">{errorMessageFile}</div>}
					</li>

					<li>
						<label className="input_label">Description</label>

						<CKEditor
							editor={ClassicEditor}
							onChange={(event, editor) => {
								const data = editor.getData();
								setInputDesc(data);
							}}
							config={{
								removePlugins: ['Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload'],
								width: 'auto'
							}}
						/>
					</li>

					<IngredientsForm
						inputingredient={inputingredient}
						listIngredients={listIngredients}
						removeIngredient={removeIngredient}
						upadateIngredient={upadateIngredient}
						addIngredient={addIngredient}
						handleInput={handleInput}
					/>
				</ul>

				<div className="flex flex-ai:center flex-jc:center padding-top">
					<button className="button button_primary" type="submit">
						Add recipe
					</button>
				</div>
			</div>
		</form>
	);
};

export default RecipesAddView;