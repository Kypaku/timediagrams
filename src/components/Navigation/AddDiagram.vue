<template>
    <v-card class="add-diagram">
        <v-card-title class="headline">
            Add diagram
        </v-card-title>
        <v-card-text>
            <v-text-field v-model="name" label="Name"/>
            <v-textarea v-model="description" label="Description"/>
            <!-- <v-btn>Load</v-btn> -->
            <input type="file" @change="loadTextFromFile">
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="add">+</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang='ts'>
	import { mapMutations } from 'vuex'
    import { Vue } from 'vue-property-decorator'
    import { uuid } from '@/helpers'

    export default Vue.extend({
        components: {

        },
        data() {
            return {
                name: '',
                description: '',
                json: '',
            }
        },
        computed: {

        },
		methods: {
            ...mapMutations(['ADD_DIAGRAM']),
            add() {
                let data
                if (this.json) {
                    data = JSON.parse(this.json)
                    data.name = this.name
                    data.description = this.description
                } else {
                    data = { name: this.name, description: this.description, layers: [], id: uuid() }
                }
                this.ADD_DIAGRAM(data)
                this.$emit('close')
            },
            loadTextFromFile(ev: any) {
                const file = ev.target.files[0]
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    this.json = e.target.result as string
                }
                reader.readAsText(file);
            },
        },
    })

    </script>

<style lang="scss" scoped>

</style>
