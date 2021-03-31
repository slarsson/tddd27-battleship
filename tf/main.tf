terraform {
    required_providers {
        digitalocean = {
            source = "digitalocean/digitalocean"
        }
    }
}

variable do_token {}

provider digitalocean {
    token = var.do_token
}

data "digitalocean_ssh_key" "home" {
    name = "desktop"
}

resource "digitalocean_droplet" "web" {
    image  = "ubuntu-20-04-x64"
    name   = "tddd27-web-1"
    region = "lon1"
    size   = "s-1vcpu-1gb-intel"
    ssh_keys = [data.digitalocean_ssh_key.home.id]
}

output "server_ip" {
    value = digitalocean_droplet.web.ipv4_address
}
