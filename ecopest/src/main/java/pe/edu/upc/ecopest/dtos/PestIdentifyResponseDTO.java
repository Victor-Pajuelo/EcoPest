package pe.edu.upc.ecopest.dtos;

public class PestIdentifyResponseDTO {
    private String answer;

    public PestIdentifyResponseDTO() { }
    public PestIdentifyResponseDTO(String answer) { this.answer = answer; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}
