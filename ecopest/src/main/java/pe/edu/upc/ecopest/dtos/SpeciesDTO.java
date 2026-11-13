package pe.edu.upc.ecopest.dtos;

public class SpeciesDTO {
    private Long id;
    private String scientificName;
    private String commonName;
    private String rank;
    private String photoUrl;
    private String wikipediaUrl;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }
    public String getCommonName() { return commonName; }
    public void setCommonName(String commonName) { this.commonName = commonName; }
    public String getRank() { return rank; }
    public void setRank(String rank) { this.rank = rank; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getWikipediaUrl() { return wikipediaUrl; }
    public void setWikipediaUrl(String wikipediaUrl) { this.wikipediaUrl = wikipediaUrl; }
}
