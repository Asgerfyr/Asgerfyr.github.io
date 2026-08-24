export const Contact = {
  render(_props: Record<string, unknown> = {}): string {
    return `
      <section id="contact" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center mb-4">
            Get In <span class="text-blue-600">Touch</span>
          </h2>
          <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Have a project in mind or want to discuss potential opportunities? Feel free to reach out!
          </p>
          <div class="flex flex-col md:flex-row gap-12">
            <div class="md:w-1/2">
              <h3 class="text-xl font-semibold mb-6">Contact Information</h3>
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="bg-blue-100 p-3 rounded-full mr-4"><i class="fas fa-envelope text-blue-600"></i></div>
                  <div><h4 class="font-medium">Email</h4><p class="text-white-600">Asger.g.stidsen@gmail.com</p></div>
                </div>
                <div class="flex items-start">
                  <div class="bg-blue-100 p-3 rounded-full mr-4"><i class="fas fa-phone-alt text-blue-600"></i></div>
                  <div><h4 class="font-medium">Phone</h4><p class="text-white-600">+45 50 56 91 45</p></div>
                </div>
                <div class="flex items-start">
                  <div class="bg-blue-100 p-3 rounded-full mr-4"><i class="fas fa-map-marker-alt text-blue-600"></i></div>
                  <div><h4 class="font-medium">Location</h4><p class="text-white-600">Hadsten 8370, Denmark</p></div>
                </div>
              </div>
              <h3 class="text-xl font-semibold mt-10 mb-6">Follow Me</h3>
              <div class="flex space-x-4">
                <a href="https://github.com/asgerfyr" class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                  <i class="fab fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/asger-stidsen-a906902b0/" class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                  <i class="fab fa-linkedin-in"></i>
                </a>
                <a href="https://stackoverflow.com/users/30637407/asger-stidsen" target="_blank" rel="noopener" class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                  <i class="fab fa-stack-overflow"></i>
                </a>
              </div>
            </div>
            <div class="md:w-1/2">
              <form id="contact-form" class="bg-white p-6 rounded-lg shadow-md text-gray-700">
                <div class="mb-4">
                  <label for="name" class="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input type="text" id="name" name="name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="mb-4">
                  <label for="email" class="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input type="email" id="email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="mb-4">
                  <label for="subject" class="block text-gray-700 font-medium mb-2">Subject</label>
                  <input type="text" id="subject" name="subject" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="mb-4">
                  <label for="message" class="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea id="message" rows="4" name="message" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        <div id="popup">Beskeden er sendt</div>
      </section>
    `;
  }
};
