const baseUrl = "https://localhost:7047/api/MusicRecord"

Vue.createApp({
    data() {
        return {
            records: [],
            allRecords: [],
            title: null,
            artist: null,

            titleToGetBy: "",
            idToGetBy: null,
            singleRecord: null,
            deleteId: null,
            deleteMessage: "",
            addData: { title: "", artist: "", year: null },
            addMessage: "",
            updateData: { id: null, title: "", artist: "", year: null },
            updateMessage: ""
        }
    },

    async created() { // life cycle method. Called when browser reloads page
        this.getAll(baseUrl)
    },

    methods: {
        getAllRecords() {
            this.getAll(baseUrl)
        },
        getByTitle(title) { // filter records by title
            const url = baseUrl + "?titleContains=" + title
            this.getRecords(url)
        },
        async getRecords(url) { // helper method: getAllRecords + getByTitle are very similar
            try {
                const response = await axios.get(url)
                this.records = response.data
                console.log(response.data)
            } catch (ex) {
                alert(ex.message) // https://www.w3schools.com/js/js_popup.asp
            }
        },
        async getById(id) {
    if (id === null || id === undefined || isNaN(id) || id <= 0) {
        alert("Please enter a valid record ID")
        return
    }

    const url = baseUrl + "/" + id
    console.log(url)

    try {
        const response = await axios.get(url)

        this.singleRecord = response.data

        console.log(response)

    } catch (ex) {
        this.singleRecord = null

        console.log(ex.response)

        if (ex.response && ex.response.status === 404) {
            alert("No record found with this ID")
        } else {
            alert(ex.message)
        }
    }
},
        async addRecord() {
            if (this.addData.title === "" || this.addData.year === null || this.addData.year <= 0) {
                alert("Please fill in all fields with valid values")
                return
            }
            // TODO more validation (title, year)
            try {
                const response = await axios.post(baseUrl, this.addData)
                this.addMessage = "response " + response.status + " " + response.statusText
                this.getAllRecords()
            } catch (ex) {
                alert(ex.message)
            }
        },
        async deleteRecord(id) {
            console.log(id)
            if (id === null || id === undefined || isNaN(id) || id <= 0) {
                alert("Please enter a valid record ID")
                return
            }
            const url = baseUrl + "/" + id
            try {
                const response = await axios.delete(url)
                this.deleteMessage = response.status + " " + response.statusText
                this.getAllRecords()
                console.log(response)
            } catch (ex) {
                alert(ex.message)
            }
        },
        async updateRecord() {
            if (this.updateData.id === null || this.updateData.id === undefined || isNaN(this.updateData.id) || this.updateData.id <= 0) {
                alert("Please enter a valid record ID")
                return
            }
            // TODO more validation (title, year)
            const url = baseUrl + "/" + this.updateData.id
            try {
                const response = await axios.put(url, this.updateData)
                this.updateMessage = "response " + response.status + " " + response.statusText
                this.getAllRecords()
            } catch (ex) {
                alert(ex.message)
            }
        },

        //--- Sort og filter --- 
        async getAll(url) {
            try {
                const response = await axios.get(url)
                this.allRecords = response.data
                this.records = this.allRecords
                console.log(this.allRecords)
            } catch (ex) {
                alert(ex.message) // https://www.w3schools.com/js/js_popup.asp
            }
        },
        sortById() {
            // https://www.w3schools.com/js/js_array_sort.asp
            this.records.sort((record1, record2) => record1.id - record2.id)
        },
        sortByTitle() {
            this.records.sort((record1, record2) => record1.title.localeCompare(record2.title))
        },
        sortByYearAscending() {
            this.records.sort((record1, record2) => record1.year - record2.year)
        },
        sortByYearDescending() {
            this.records.sort((record1, record2) => record2.year - record1.year)
        },

        filterByTitle(title) {
            console.log("Title:" + title + ":")
            console.log("All records " + this.allRecords)
            this.records = this.allRecords.filter(r => r.title.includes(title))
            console.log("filtered Records: " + this.records)
        }
    }
}).mount("#app")
