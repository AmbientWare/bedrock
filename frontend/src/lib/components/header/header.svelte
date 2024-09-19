<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let projectName = '';

	function validateInput() {
		if (!projectName) {
			alert('Project name is required');
			return false;
		}
		return true;
	}

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (!files || files.length === 0) return;

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}

		// add project name to form data
		formData.append('project', projectName);

		try {
			const response = await fetch('/files/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				alert('Upload successful');
			} else {
				alert('Upload failed');
			}
		} catch (error) {
			alert('Error during upload');
		}
	}
</script>

<input type="file" id="fileInput" multiple on:change={handleFileUpload} style="display: none;" />

<header class="flex items-center justify-end p-4">
	<div class="flex items-center gap-2">
		<Input type="text" id="projectName" bind:value={projectName} placeholder="Enter project name" />
		<Button
			on:click={() => {
				const valid = validateInput();
				valid ? document.getElementById('fileInput')?.click() : alert('Project name is required');
			}}>Create Project</Button
		>
	</div>
</header>
