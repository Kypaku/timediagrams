<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-title class="headline">Welcome to KyTimediagrams!</v-card-title>
                <v-card-text>Hello! It is a demo application for creating time diagrams with layers and blocks.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click.native="dialog = false">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script lang='ts'>
	import {mapMutations} from 'vuex'
    import { Vue } from 'vue-property-decorator'

    export default Vue.extend({
        components: {

        },
        data() {
            return {
                dialog: true,
            }
        },
        computed: {

        },
		methods: {
            ...mapMutations(['SET_OLD_USER']),

        },
        created() {
            if (this.$store.state.settings.oldUser) {
                this.dialog = false
            }
            this.SET_OLD_USER(true)
        },
    })

    </script>

<style lang="scss" scoped>

</style>
