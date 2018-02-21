<template>
	<div class="app-collection">

		<div class="gallery-wrap">
			<ul class="gallery">
				<li v-for="(collection, key) in collections" :key="key">

					<div class="item">
						<div class="inner">
							<img :src="'file:///'+ collection" alt=""/>

							<button class="button remove" @click="removeCollectionItem(collection)">
								<icon name="times"></icon>
							</button>

							<!--
							<button class="button share">
								<icon name="share-alt"></icon>
							</button>
							-->

						</div>
					</div>

				</li>
			</ul>
		</div>

	</div>
</template>

<script>

	import main from '../../lib/main'

	export default {

		name: 'Collection',

		data() {
			return {
				collections: null,
			};
		},

		watch: {

			'$route': function () {
				main.getCollections(files => {
					this.collections = files;
				});
			}

		},

		methods: {

			removeCollectionItem(file) {
				main.removeCollections([file], main.removeFromCollection).then(() => {
					main.getCollections(files => {
						this.collections = files;
					});
				});
			}

		},

		beforeMount() {

			main.getCollections(files => {
				this.collections = files;
			});

		},

	}
</script>
