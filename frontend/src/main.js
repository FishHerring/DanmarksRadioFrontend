
const baseURL = "https://localhost:7047/api/MusicRecord";

Vue.createApp({

    data() {
        return {
            records: [],
            allRecords: [],

            title: "",
            titleToGetBy: "",
            idToGetBy: null,

            singleRecord: null,

            deleteId: null,
            deletemessage: "",

            addData: {
                title: "",
                artist: ""
            },
            addmessage: "",

            updateData: {
                id: null,
                title: "",
                artist: ""
            },
            updatemessage: ""
        };
    },

    // Henter alle records, når siden åbnes
    mounted() {
        this.getAllRecords();
    },

    methods: {

        // GET ALL
        getAllRecords() {
            this.getRecord(baseURL);
        },

        // GET BY TITLE
        getByTitle(title) {

    if (!title || title.trim() === "") {
        this.getAllRecords();
        return;
    }

    const url = baseURL + "?titleContains=" + encodeURIComponent(title);

    this.getRecord(url);
},

        // Henter records fra API
        async getRecord(url) {

            try {
                const response = await axios.get(url);

                this.records = response.data;
                this.allRecords = [...response.data];

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

            const url = baseURL + "/" + id;

            try {
                const response = await axios.get(url);

                this.singleRecord = response.data;

            } catch (ex) {
                this.singleRecord = null;
                alert(ex.message);
            }
        },

        // DELETE
        async deleteRecord(deleteId) {

            if (!deleteId || isNaN(deleteId) || deleteId <= 0) {
                alert("Please enter a valid record ID");
                return;
            }

            const url = baseURL + "/" + deleteId;

            try {
                const response = await axios.delete(url);

                this.deletemessage =
                    response.status + " " + response.statusText;

                this.getAllRecords();

            } catch (ex) {
                alert(ex.message);
            }
        },

        // POST - ADD RECORD
        async addRecord() {

            if (
                this.addData.title.trim() === "" ||
                this.addData.artist.trim() === ""
            ) {
                alert("Please fill in title and artist");
                return;
            }

            try {

                const response = await axios.post(baseURL, this.addData);

                this.addmessage =
                    response.status + " " + response.statusText;

                this.addData = {
                    title: "",
                    artist: ""
                };

                this.getAllRecords();

            } catch (ex) {
                alert(ex.message);
            }
        },

        // PUT - UPDATE RECORD
        async updateRecord() {

            if (
                !this.updateData.id ||
                isNaN(this.updateData.id) ||
                this.updateData.id <= 0
            ) {
                alert("Please enter a valid record ID");
                return;
            }

            if (
                this.updateData.title.trim() === "" ||
                this.updateData.artist.trim() === ""
            ) {
                alert("Please fill in title and artist");
                return;
            }

            const url = baseURL + "/" + this.updateData.id;

            try {

                const response = await axios.put(url, this.updateData);

                this.updatemessage =
                    response.status + " " + response.statusText;

                this.getAllRecords();

            } catch (ex) {
                alert(ex.message);
            }
        },

        // SORT BY TITLE
        sortByTitle() {

            this.records.sort(
                (record1, record2) =>
                    record1.title.localeCompare(record2.title)
            );
        },

        // SORT BY ARTIST
        sortByArtist() {

            this.records.sort(
                (record1, record2) =>
                    record1.artist.localeCompare(record2.artist)
            );
        },

        // FILTER BY TITLE
        filterByTitle(title) {

            if (!title || title.trim() === "") {
                this.records = [...this.allRecords];
                return;
            }

            this.records = this.allRecords.filter(record =>
                record.title.toLowerCase().includes(title.toLowerCase())
            );
        }

    }

}).mount("#app");
