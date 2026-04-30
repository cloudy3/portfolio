export function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null;

    if (!gl) return false;

    gl.getExtension("OES_texture_float");
    gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("OES_vertex_array_object");
    gl.getExtension("WEBGL_vertex_array_object");

    const shader = gl.createShader(gl.VERTEX_SHADER);
    if (!shader) return false;

    gl.shaderSource(
      shader,
      "attribute vec4 position; void main() { gl_Position = position; }"
    );
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    gl.deleteShader(shader);
    return success;
  } catch {
    return false;
  }
}
