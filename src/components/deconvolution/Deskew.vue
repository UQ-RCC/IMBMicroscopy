<template>
    <v-card :disabled="readonly">
        <v-row>
            <v-col cols="20" sm="4" md="5">
                <v-switch
                    v-model="serie.deskew"
                    label="Deskew"
                    >
                </v-switch>
            </v-col>
            <v-col cols="20" sm="4" md="5" v-if="serie.deskew">
                <v-switch
                    v-model="serie.keepDeskew"
                    label="Keep Deskewed Files"
                    >
                </v-switch>
            </v-col>
        </v-row>
        <v-row align="center" justify="center" v-if="serie.deskew">  
            <v-col cols="5" sm="2" md="3">
                <v-text-field 
                    v-model="serie.angle"
                    regular 
                    type=number
                    :rules="numberRules" 
                    label="Angle">
                </v-text-field>
            </v-col>
            <v-col cols="5" sm="3" md="3">
                <v-text-field 
                    v-model="serie.threshold"
                    regular
                    type=number
                    :rules="numberRules" 
                    label="Background">
                </v-text-field>
            </v-col>
            <v-col cols="15" sm="5" md="6" dense>
                <v-col cols="15" sm="5" md="6">
                    Median Background: {{serie.background}}
                </v-col>
                <v-col cols="15" sm="5" md="6">
                    Standard deviation: {{serie.stddev}}
                </v-col>
            </v-col>
        </v-row>
        
        <v-data-table
            :headers="deskewMetadataTableHeaders"
            :items="[{unit: serie.unit, pixelWidth: serie.pixelWidth, pixelHeight: serie.pixelHeight, pixelDepth: serie.pixelDepth }]"
            class="elevation-1"
            hide-default-footer
            v-if="serie.deskew"
            >
                <template v-slot:top>
                    <v-dialog 
                        v-model="deskewEditDialog"
                        persistent
                        max-width="500px"
                    >
                        <v-card>
                            <v-card-title>
                            <span class="headline">Edit deskew metadata</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                    <v-col
                                        cols="12"
                                        sm="6"
                                        md="4"
                                    >
                                        <v-select
                                            :items="units"
                                            v-model="serie.unit"
                                            label="Unit"
                                            outlined
                                            return-object
                                            >
                                        </v-select>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        sm="6"
                                        md="4"
                                    >
                                        <v-text-field
                                            v-model="serie.pixelWidth"
                                            label="Pixel Width" type="number"
                                            :rules="numberRules" 
                                        ></v-text-field>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        sm="6"
                                        md="4"
                                    >
                                            <v-text-field
                                            v-model="serie.pixelHeight"
                                            label="Pixel Height" type="number"
                                            :rules="numberRules" 
                                        ></v-text-field>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        sm="6"
                                        md="4"
                                    >
                                        <v-text-field
                                            v-model="serie.pixelDepth"
                                            label="Voxel Depth" type="number"
                                            :rules="numberRules" 
                                        ></v-text-field>
                                    </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    :disabled="!valid_dialog_values"
                                    @click="saveDeskewDialog"
                                >
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-icon
                    small
                    class="mr-2"
                    @click="editDeskewItem(item)"
                    >
                    mdi-pencil
                    </v-icon>
                </template>
        </v-data-table>
    </v-card>
</template>


<script>
    // import Vue from 'vue';
    import series from "@/utils/series.js";

    export default {
        name: 'DeconvolutionDeskew',
        props: {
            readonly: { type: Boolean, default: false }, 
        },
        data() {
            return {
                valid: true,
                serie: series.formatSeries(null),
                //deskew edit
                deskewEditDialog: false,
                //deskew metadata
                deskewMetadataTableHeaders: [
                    {
                        text: 'Unit',
                        align: 'center',
                        sortable: false,
                        value: 'unit',
                    },
                    {
                        text: 'Pixel Width',
                        align: 'center',
                        sortable: false,
                        value: 'pixelWidth',
                    },
                    {
                        text: 'Pixel Height',
                        align: 'center',
                        sortable: false,
                        value: 'pixelHeight',
                    },
                    {
                        text: 'Voxel Depth',
                        align: 'center',
                        sortable: false,
                        value: 'pixelDepth',
                    },
                    {   
                        text: 'Edit', 
                        value: 'actions', 
                        sortable: false 
                    },
                ],
                units: [ 'nm', 'µm', 'mm', 'inch' ],
                numberRules: [
                    value => value && value >= 0 || 'Must be 0 or a positive number'
                ],
            }
        },
        methods: {
            // return the data
            get_serie(){
                return this.serie
            },
            load_serie(serie){
                this.serie = serie
            },
            // edit dekew
            editDeskewItem () {
                this.deskewEditDialog = true
            },
            saveDeskewDialog(){
                this.deskewEditDialog = false
            },
            is_valid(){
                if(!this.serie.deskew || 
                    (
                        (this.serie.angle && this.serie.angle > 0)&&
                        (this.serie.threshold &&this.serie.threshold >=0) &&
                        this.serie.unit &&
                        (this.serie.pixelWidth && this.serie.pixelWidth > 0) &&
                        (this.serie.pixelHeight && this.serie.pixelHeight > 0) &&
                        (this.serie.pixelDepth && this.serie.pixelDepth > 0) 
                    ) )
                    return true
                else
                    return false
            } 
        },
        computed: {
            valid_dialog_values(){
                if(this.serie.pixelWidth && 
                    this.serie.pixelHeight &&
                    this.serie.pixelDepth)
                    return true
                else
                    return false
            }
        }
    }
</script>
