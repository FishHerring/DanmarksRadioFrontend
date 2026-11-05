
const baseUrl = "https://localhost:7047/api/MusicRecord";

Vue.createApp({
    data() {
        return {
            records: [],
            allRecords: [],

            title: "",
            artist: "",

            titleToGetBy: "",
            idToGetBy: null,
            singleRecord: null,

            deleteId: null,
            deleteMessage: "",

            addData: {
                title: "",
                artist: "",
                publicationYear: null,
                duration: null
            },
            addMessage: "",

            updateData: {
                id: null,
                title: "",
                artist: "",
                publicationYear: null,
                duration: null
            },
            updateMessage: ""
        };
    },

    // Load records when website opens
    created() {
        this.getAllRecords();
    },

    methods: {

        // GET ALL
        getAllRecords() {
            return this.getAll(baseUrl);
        },

        // GET BY TITLE
        getByTitle(title) {
            if (!title || title.trim() === "") {
                this.getAllRecords();
                return;
            }

            const url = baseUrl + "?titleContains=" +
                encodeURIComponent(title);

            this.getRecords(url);
        },

        // GET RECORDS
        async getRecords(url) {
            try {
                const response = await axios.get(url);
                this.records = response.data;
                console.log(response.data);
            } catch (ex) {
                alert(ex.message);
            }
        },

        // GET BY ID
        async getById(id) {
            if (!id || isNaN(id) || id <= 0) {
                alert("Please enter a valid record ID");
                return;
            }

            const url = baseUrl + "/" + id;

            try {
                const response = await axios.get(url);
                this.singleRecord = response.data;
            } catch (ex) {
                this.singleRecord = null;
                alert(ex.message);
            }
        },

        // ADD RECORD
        async addRecord() {
            if (
                !this.addData.title.trim() ||
                !this.addData.artist.trim() ||
                !this.addData.publicationYear ||
                this.addData.publicationYear <= 0 ||
                !this.addData.duration ||
                this.addData.duration <= 0
            ) {
                alert("Please fill in all fields");
                return;
            }

            try {
                const response = await axios.post(
                    baseUrl,
                    this.addData
                );

                this.addMessage = "Record added successfully!";

                console.log("Added:", response.data);

                this.addData = {
                    title: "",
                    artist: "",
                    publicationYear: null,
                    duration: null
                };

                await this.getAllRecords();

            } catch (ex) {
                alert(ex.message);
            }
        },

        // DELETE RECORD
        async deleteRecord(id) {
            if (!id || isNaN(id) || id <= 0) {
                alert("Please enter a valid record ID");
                return;
            }

            const url = baseUrl + "/" + id;

            try {
                await axios.delete(url);

                this.deleteMessage = "Record deleted!";

                await this.getAllRecords();

            } catch (ex) {
                alert(ex.message);
            }
        },

        // UPDATE RECORD
        async updateRecord() {
            if (
                !this.updateData.id ||
                this.updateData.id <= 0
            ) {
                alert("Please enter a valid record ID");
                return;
            }

            const url = baseUrl + "/" + this.updateData.id;

            try {
                await axios.put(url, this.updateData);

                this.updateMessage = "Record updated!";

                await this.getAllRecords();

            } catch (ex) {
                alert(ex.message);
            }
        },

        // GET ALL FOR SORTING AND FILTERING
        async getAll(url) {
            try {
                const response = await axios.get(url);

                this.allRecords = response.data;
                this.records = [...this.allRecords];

                console.log(this.allRecords);

            } catch (ex) {
                alert(ex.message);
            }
        },

        // SORT BY ID
        sortById() {
            this.records.sort((a, b) => a.id - b.id);
        },

        // SORT BY TITLE
        sortByTitle() {
            this.records.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
        },

        // SORT BY PUBLICATION YEAR ASCENDING
        sortByYearAscending() {
            this.records.sort((a, b) =>
                a.publicationYear - b.publicationYear
            );
        },

        // SORT BY PUBLICATION YEAR DESCENDING
        sortByYearDescending() {
            this.records.sort((a, b) =>
                b.publicationYear - a.publicationYear
            );
        },

        // FILTER BY TITLE
        filterByTitle(title) {
            if (!title) {
                this.records = [...this.allRecords];
                return;
            }

            this.records = this.allRecords.filter(record =>
                record.title.toLowerCase().includes(
                    title.toLowerCase()
                )
            );
        }
    }

}).mount("#app");
