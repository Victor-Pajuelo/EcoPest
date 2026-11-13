package pe.edu.upc.ecopest.dtos;

public class PestIdentifyRequestDTO {
    private String text;
    private String imageBase64;
    private String mimeType;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
}
